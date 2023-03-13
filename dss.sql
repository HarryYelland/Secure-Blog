DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Posts;

CREATE TABLE User(  
    User_ID INT AUTO_INCREMENT,  
    Username VARCHAR(20),  
    Password VARCHAR(256),
    Email VARCHAR(30),
    Session VARCHAR(256),
    2FA INTEGER,
    PRIMARY KEY(User_ID)
);  

CREATE TABLE Posts(
    Post_ID serial AUTO_INCREMENT PRIMARY KEY,
    Post_Title VARCHAR(20),
    Post_Body VARCHAR(200),
    Author INT,
    Is_Private BOOLEAN,
    PRIMARY KEY(Post_ID),
    CONSTRAINT User
      FOREIGN KEY(Author)
        REFERENCES User(User_ID)
	ON DELETE CASCADE
);