BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "films" (
	"id"	INTEGER,
	"title"	TEXT NOT NULL,
	"favorite"	INTEGER NOT NULL DEFAULT (0),
	"watchdate"	TEXT,
	"rating"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT) 
);
INSERT INTO "films" ("title","favorite","watchdate","rating") VALUES ('Pulp Fiction',1,'2023-03-10',5);
INSERT INTO "films" ("title","favorite","watchdate","rating") VALUES ('21 Grams',1,'2023-03-17',4);
INSERT INTO "films" ("title","favorite","watchdate","rating") VALUES ('Star Wars',0,NULL,NULL);
INSERT INTO "films" ("title","favorite","watchdate","rating") VALUES ('Matrix',0,NULL,NULL);
INSERT INTO "films" ("title","favorite","watchdate","rating") VALUES ('Shrek',0,'2023-03-21',3);
COMMIT;
