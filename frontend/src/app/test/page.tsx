'use client'

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import { useModal } from "@/components";
import { CompanySearch } from "@/components/companySearch";
import { useSessionContext } from "@/context/SessionContext";

import styles from './index.module.css';
import React from "react";

const reorder = (list: Array<any>, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const TileList = ({ tiles, isEditing }: { tiles: Array<any>, isEditing: boolean }) => {
  console.log(isEditing);
  return tiles.map((tile: any, index: number) => (
    <Draggable key={index} draggableId={tile.id} index={index} isDragDisabled={!isEditing}>
      {provided => (
        <div
          className={styles.tile}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
        <h2>{tile.title}</h2>
        <div>{tile.content}</div>
      </div>
      )}
    </Draggable>
  ));
}

const AddStock = ({ addSymbol }: { addSymbol: (symbol: string) => void }) => {
  const { Modal, openModal } = useModal({ header: 'Search', children: <CompanySearch onSelect={addSymbol} /> });

  return (
    <div>
      <button onClick={openModal}>+</button>
      {Modal}
    </div>
  )
}

export default function Secure() {
  const { session } = useSessionContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const [userSymbols, setUserSymbols] = useState<Array<string>>([]); // ['AAPL', 'TSLA', 'MSFT']
  const [currentSymbol, setCurrentSymbol] = useState<string>(''); // ['AAPL', 'TSLA', 'MSFT'

  const initialTiles = [
    //{ id: '0', content: <Search />, title: "Select Stock" }, //<Tile title="Company Search" content={<Search />} isEditing={isEditMode} />
    { id: '1', content: "other stuff 1", title: "Other" }, //<Tile title="other stuff" content="other stuff" isEditing={isEditMode} />
    { id: '2', content: "other stuff 2", title: "Other" },
    { id: '3', content: "other stuff 3", title: "Other" },
    { id: '4', content: "other stuff 4", title: "Other" },
  ];

  const [tiles, setTiles] = useState(initialTiles);

  const onDragEnd = (result: { source: any; destination: any; }) => {
    if (!isEditMode) return;

    const { source, destination } = result;
    if (!destination || destination.index === source.index) return;

    const reordered = reorder(
      tiles,
      source.index,
      destination.index
    );

    setTiles(reordered);
  };

  const handleAddSymbol = (symbol: string) => {
    setUserSymbols([...userSymbols, symbol].sort());
    setCurrentSymbol(symbol);
  }

  if (session) {
    return (
      <main className={styles.dashboard}>
        <section>
          <AddStock addSymbol={handleAddSymbol} />
        </section>
        <section>
          {/* <button onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
          </button> */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tiles" direction="horizontal" isDropDisabled={!isEditMode}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className={styles.tile_container}>
                  <TileList tiles={tiles} isEditing={isEditMode} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </section>
      </main>
    )
  }

  return <h1>No User Permission</h1>
}
