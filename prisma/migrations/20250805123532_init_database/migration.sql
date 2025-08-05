-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pokemon" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type1" TEXT NOT NULL,
    "type2" TEXT,
    "total" INTEGER NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "spAttack" INTEGER NOT NULL,
    "spDefense" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "generation" INTEGER NOT NULL,
    "legendary" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "ytbUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_favorite_pokemon" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorite_pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorite_pokemon_userId_pokemonId_key" ON "public"."user_favorite_pokemon"("userId", "pokemonId");

-- AddForeignKey
ALTER TABLE "public"."user_favorite_pokemon" ADD CONSTRAINT "user_favorite_pokemon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_favorite_pokemon" ADD CONSTRAINT "user_favorite_pokemon_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "public"."pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
