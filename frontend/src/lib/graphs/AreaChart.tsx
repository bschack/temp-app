import React, { useMemo, useCallback } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector, min } from '@visx/vendor/d3-array';
import { timeFormat } from '@visx/vendor/d3-time-format';
import { data } from './mocks';
import { SeriesResponse, SeriesResponseSchema, SeriesValue } from '../rapid/schema';

type TooltipData = SeriesValue;

export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
const getDate = (d: SeriesValue) => d.datetime;
const getStockValue = (d: SeriesValue) => d.close;
const bisectDate = bisector<SeriesValue, Date>((d) => d.datetime).left;


export type AreaProps = {
  series: SeriesResponse;
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export const AreaChart = withTooltip<AreaProps, TooltipData>(
  ({
    series,
    width,
    height,
    margin = { top: 5, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null;

    const stock = series.values.sort((a, b) => getDate(a).valueOf() - getDate(b).valueOf());
    const isPositive = getStockValue(stock[stock.length - 1]) > getStockValue(stock[0]);
    
    // bounds
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(stock, getDate) as [Date, Date],
        }),
      [innerWidth, margin.left, stock],
    );
    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [(min(stock, getStockValue) || 0), (max(stock, getStockValue) || 0) + margin.top],
          nice: true,
        }),
      [innerHeight, margin.top, stock],
    );

    // tooltip handler
    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(stock, x0, 1);
        const d0 = stock[index - 1];
        const d1 = stock[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d)),
        });
      },
      [dateScale, stock, showTooltip, stockValueScale],
    );

    return (
      <div>
        <svg width={width} height={height}>
          {/* <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          /> */}
          {/* <LinearGradient id="area-background-gradient" from={background} to={background2} /> */}
          <LinearGradient id="area-gradient" from={isPositive ? 'green' : 'red'} to={isPositive ? 'green' : 'red'} toOpacity={0.1} fromOpacity={0.5} />
          <LinearGradient id="line-gradient" from={isPositive ? 'green' : 'red'} to={isPositive ? 'green' : 'red'} toOpacity={0.1} fromOpacity={1} />
          {/* <GridRows
            left={margin.left}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          /> */}
          {/* <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          /> */}
          <AreaClosed<SeriesValue>
            data={stock}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => stockValueScale(getStockValue(d)) ?? 0}
            yScale={stockValueScale}
            strokeWidth={2}
            stroke="url(#line-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <Tooltip
              key={Math.random()}
              top={tooltipTop - 24}
              left={tooltipLeft}
              style={tooltipStyles}
            >
              {`$${getStockValue(tooltipData)}`}
            </Tooltip>
            <Tooltip
              top={innerHeight + margin.top}
              left={tooltipLeft}
              style={{
                textAlign: 'center',
                transform: 'translateX(-50%)',
                minWidth: 90,
                ...defaultStyles,
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);