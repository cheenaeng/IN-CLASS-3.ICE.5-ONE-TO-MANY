DROP TABLE IF EXISTS cats;
DROP TABLE IF EXISTS owners;


CREATE TABLE owners (
    id SERIAL PRIMARY KEY,
    name TEXT
);

INSERT INTO owners (name) VALUES ('Kai');


CREATE TABLE cats (
    id SERIAL PRIMARY KEY,
    name TEXT,
    owners_id INTEGER,
    CONSTRAINT fk_owners
    FOREIGN KEY(owners_id)
      REFERENCES owners(id)
);