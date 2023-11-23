-- Create the 'user' table
CREATE TABLE user (
  id_user INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  no_telepon VARCHAR(15) NOT NULL
);

-- Create the 'prediction_history' table
CREATE TABLE prediction_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_user INT,
  prediction_result VARCHAR(255) NOT NULL,
  image_name VARCHAR(255) NOT NULL,
  FOREIGN KEY (id_user) REFERENCES user(id_user)
);

-- Insert dummy data into the user table
INSERT INTO user (username, name, password_hash, no_telepon)
VALUES
  ('john_doe', 'John Doe', 'hashed_password_1', '6285123456'),
  ('jane_smith', 'Jane Smith', 'hashed_password_2', '6285123457'),
  ('bob_jones', 'Bob Jones', 'hashed_password_3', '6285123458');

-- Insert dummy data into the prediction_history table
INSERT INTO prediction_history (id_user, prediction_result, image_name)
VALUES
  (1, 'Prediction A', 'image1.jpg'),
  (1, 'Prediction B', 'image2.jpg'),
  (2, 'Prediction C', 'image3.jpg'),
  (3, 'Prediction D', 'image4.jpg');
