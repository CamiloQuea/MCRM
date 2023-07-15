import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
export default authMiddleware({
    publicRoutes: ["/"],
    signInUrl: "/login",
    afterAuth(auth, req, evt) {
        // handle users who aren't authenticated

        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url });
        }

        if (auth.userId && req.nextUrl.pathname === '/login') {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    },

});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};