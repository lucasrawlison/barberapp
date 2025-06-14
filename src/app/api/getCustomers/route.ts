import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page   = parseInt(searchParams.get("page") || "1", 10);
    const limit  = parseInt(searchParams.get("limit") || "10", 10);
    const skip   = (page - 1) * limit;
    const search = searchParams.get("search")?.trim();

    // 1) Liste aqui os campos que você quer buscar
    const searchableFields: Array<keyof Prisma.CustomerWhereInput> = [
      "name",
      "email",
      "phone",
      // se quiser incluir outros campos string, adicione aqui
    ];

    // 2) Crie o filtro OR dinamicamente
    const mode: Prisma.QueryMode = "insensitive";
    const where: Prisma.CustomerWhereInput = search
      ? {
          OR: searchableFields.map((field) => ({
            [field]: { contains: search, mode },
          })),
        }
      : {};

    // 3) Execute a busca e a contagem
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: "desc" },
        include: { services: true },
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json(
      {
        customers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching customers", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
