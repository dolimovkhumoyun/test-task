CREATE TABLE users
(
    id SERIAL,
    username varchar(256),
    password varchar(256),
    full_name text,
    phone_number text,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

INSERT INTO 
    users(username, password, full_name, phone_number) 
VALUES 
    ('admin', md5(md5(md5('admin'))), 'Mirzo Dolimov', '+998999828770');