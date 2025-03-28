import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("Este é o body: ", body);

    const { userId, date } = body;

    if (!userId) {
      return NextResponse.json(
        {
          message: "No userId detected",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 400 }
      );
    }

    if (user.profileType === "admin") {
      if(date) {
        // CASO TENHA DATA
        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0);
        const finalDate = new Date(date);
        finalDate.setUTCHours(23, 59, 59, 999);

        // console.log(startDate, finalDate);

        const services = await prisma.service.findMany({
          where: {
            createdAt: {
              gte: startDate,
              lte: finalDate,
            },
          },

          orderBy: {
            id: "desc",
          },
          include: {
            user: true,
            paymentMethod: {
              include:{bankAccount:true}
            }
            
          },
        });
        if (services) {
          return NextResponse.json(
            { message: "Services", services },
            { status: 200 }
          );
        }else{
          return NextResponse.json(
            { message: "No services found" },
            { status: 200 }
          );
        }
      }else{
        // CASO TENHA DATA
        const services = await prisma.service.findMany({
          orderBy: {
            id: "desc",
          },
          include: {
            user: true,
            paymentMethod: {
              include:{bankAccount:true}
            }
            
          },
        });
        if (services) {
          return NextResponse.json(
            { message: "Services", services },
            { status: 200 }
          );
        }else{
          return NextResponse.json(
            { message: "No services found" },
            { status: 200 }
          );
        }
        
      }

    }


    if (user.profileType === "barber") {
      if(date) {
        // CASO TENHA DATA
        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0);
        const finalDate = new Date(date);
        finalDate.setUTCHours(23, 59, 59, 999);

        // console.log(startDate, finalDate);
        const services = await prisma.service.findMany({
          where: {
            AND: [
              {
                createdAt: {
                  gte: startDate,
                  lte: finalDate,
                },
              },
              { userId: userId },
            ],
          },
          orderBy: {
            id: "desc",
          },
          include: {
            user: true,
            paymentMethod: {
              include:{bankAccount:true}
            }
            
          },
        });

        if (services) {
          return NextResponse.json(
            { message: "Services", services },
            { status: 200 }
          );
        }else{
          return NextResponse.json(
            { message: "No services found" },
            { status: 200 }
          );
        }
      }else{

        const services = await prisma.service.findMany({
          where: {
            userId: userId,
          },
          orderBy: {
            id: "desc",
          },
          include: {
            user: true,
            paymentMethod: {
              include:{bankAccount:true}
            }
            
          },
        });

        if (services) {
          return NextResponse.json(
            { message: "Services", services },
            { status: 200 }
          );
        }else{
          return NextResponse.json(
            { message: "No services found" },
            { status: 200 }
          );
        }
      }


      
    }
  } catch (error) {
    console.error("Error fetching services", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
