/* Basic Updated SQL file. */

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Posts;

CREATE TABLE Users(
    User_ID SERIAL,
    Username VARCHAR(20),
    Password VARCHAR(256),
    Email VARCHAR(30),
    Session VARCHAR(256),
    Two_FA INTEGER,
    PRIMARY KEY(User_ID)
);

CREATE TABLE Posts(
    Post_ID SERIAL,
    Post_Title VARCHAR(20),
    Post_Body VARCHAR(200),
    Author INT,
    Is_Private BOOLEAN,
    PRIMARY KEY(Post_ID),
    CONSTRAINT Users
      FOREIGN KEY(Author)
        REFERENCES Users(User_ID)
	ON DELETE CASCADE
);