// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get('token');
//   const { pathname } = req.nextUrl;

//   // If user is logged in and tries to access the login page, redirect to home page
//   if (token && pathname === '/login') {
//     return NextResponse.redirect(new URL('/', req.url));
//   }

//   // If user is not logged in and tries to access the home page, redirect to login page
//   if (!token && pathname === '/') {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   // Continue with the request if none of the above conditions are met
//   return NextResponse.next();
// }
