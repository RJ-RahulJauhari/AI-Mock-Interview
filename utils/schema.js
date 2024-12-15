import { varchar, serial, text, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core"
import { FileKey } from "lucide-react";

export const userSystemEnum = pgEnum("user_system_enum", ['system','user']);


export const MockInterview = pgTable(
    "MockInterview",
    {
        id:serial('id').primaryKey(),
        jsonMockResp: text('jsonMockResp').notNull(),
        jobPosition: varchar('jobPosition').notNull(),
        jobDesc: varchar('jobDesc').notNull(),
        jobExperience: varchar('jobExperience').notNull(),
        createdBy: varchar('createdBy').notNull(),
        createdAt: varchar("createdAt"),
        mockId: varchar('mockId').notNull()
    }
)


export const UserAnswerInterview = pgTable(
    "userAnswer",
    {
        id:serial('id').primaryKey(),
        mockIdRef: varchar('mockId').notNull(),
        question: varchar('question').notNull(),
        correctAns: text('correctAns'),
        userAns: text('userAns'),
        feedback: text('feedback'),
        rating: varchar('rating'),
        userEmail: varchar('userEmail'),
        createdAt: varchar('createdAt')
    }
)

export const Chats = pgTable(
    "chats",{
        id: serial("id").primaryKey(),
        pdfName: text("pdf_name").notNull(),
        pdfUrl: text("pdf_url").notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        userId: varchar("user_id", {length:256}).notNull(),
        fileKey: text('file_key').notNull()
    }
)

export const Messages = pgTable(
    "messages",
    {
        id: serial("id").primaryKey(),
        chatId: integer("chat_id").references(() => Chats.id).notNull(),
        content: text('content').notNull(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        role: userSystemEnum('role').notNull()        
    }
)