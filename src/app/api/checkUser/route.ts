import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req : NextRequest) {
    
    try {
        const body = await req.json();
        console.log("Estewerwerwer é o body: ", body);
        const {id} = body;

        if(!id) {
            return NextResponse.json({
                message: "User ID is required"
            }, {status: 400})
        }
        const activeUser = await prisma.user.findUnique({
            where: {id},
            include: {
                services: true
            }
        })

        if(activeUser?.profileType === "admin") {
            return NextResponse.json({
                message: "User is not an admin"
            }, {status: 400})
        }

        if(!activeUser) {
            return NextResponse.json({
                message: "User not found"
            }, {status: 400})
        }

        return NextResponse.json(activeUser, {status: 200})
    } catch (error) {
        return NextResponse.json({
            message: "Internal server error", error
        }, {status: 500})
    }
}