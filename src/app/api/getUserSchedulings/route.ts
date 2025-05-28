import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("Este é o body: ", body);

    const { userId, date, page, limit } = body;
    const skip = (page - 1) * limit;
    

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

        const [schedulings, /*total*/] =  await Promise.all(
          [
            prisma.scheduling.findMany({
              // skip,
              // take: limit,
              where: {
                date: {
                  gte: startDate,
                  lte: finalDate,
                },
              },
    
              orderBy: {
                id: "desc",
              },
              include: {
                user: true,
                customer: true,
                
              },
            }),
            // prisma.scheduling.count({
            //   where: {
            //     date: {
            //       gte: startDate,
            //       lte: finalDate,
            //     },
            //   },
            // }),
          ]) 
          if (schedulings) {
            return NextResponse.json(
              { message: "schedulings", schedulings,
                // pagination: {
                //   total,
                //   page,
                //   limit,
                //   totalPages: Math.ceil(total / limit),
                // },
               },
              { status: 200 }
            );
        }else{
          return NextResponse.json(
            { message: "No schedulings found" },
            { status: 200 }
          );
        }
      }else{
        // CASO NÃO TENHA DATA

        const [schedulings, total] = await Promise.all([

          prisma.scheduling.findMany({
            skip,
              take: limit,
           orderBy: {
             id: "desc",
           },
           include: {
             user: true,
             customer: true,
           },
         }),
          prisma.scheduling.count(),
        ])
        if (schedulings) {
          return NextResponse.json(
            { message: "schedulings", schedulings,
              pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
              },
             },
            { status: 200 }
          );
        }else{
          return NextResponse.json(
            { message: "No schedulings found" },
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
        const [schedulings, /*total*/] = await Promise.all([

          prisma.scheduling.findMany({
            // skip,
            //   take: limit,
            where: {
              AND: [
                {
                  date: {
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
              customer: true,
            },
          }),
          // prisma.scheduling.count({
          //   where: {
          //     AND: [
          //       {
          //         date: {
          //           gte: startDate,
          //           lte: finalDate,
          //         },
          //       },
          //       { userId: userId },
          //     ],
          //   },
          // }),
        ]) 

        if (schedulings) {
          return NextResponse.json(
            { message: "schedulings", schedulings,
              // pagination: {
              //   total,
              //   page,
              //   limit,
              //   totalPages: Math.ceil(total / limit),
              // },
             },
            { status: 200 }
          );
        }else{
          return NextResponse.json(
            { message: "No schedulings found" },
            { status: 200 }
          );
        }
      }else{

        const [schedulings, total] = await Promise.all([

          prisma.scheduling.findMany({
            skip,
              take: limit,
           where: {
             userId: userId,
           },
           orderBy: {
             id: "desc",
           },
           include: {
             user: true,
             customer: true,
           },
         }),
          prisma.scheduling.count({
            where: {
              userId: userId,
            },
          }),
        ])

        if (schedulings) {
          return NextResponse.json(
            { message: "schedulings", schedulings,
              pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
              },
             },
            { status: 200 }
          );
        }else{
          return NextResponse.json(
            { message: "No schedulings found" },
            { status: 200 }
          );
        }
      }


      
    }
  } catch (error) {
    console.error("Error fetching schedulings", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
