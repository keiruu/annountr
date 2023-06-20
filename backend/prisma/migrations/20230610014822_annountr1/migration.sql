-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "desc" TEXT,
    "deadline" BOOLEAN NOT NULL,
    "date" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
