USE master;
GO

IF EXISTS (SELECT * FROM sys.server_principals WHERE name = 'student')
BEGIN
    ALTER LOGIN student WITH PASSWORD = 'fitfit';
    ALTER LOGIN student ENABLE;
END
ELSE
BEGIN
    CREATE LOGIN student WITH PASSWORD = 'fitfit';
END
GO

USE SAA; 
GO


IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'student')
BEGIN
    DROP USER student;
END

CREATE USER student FOR LOGIN student;


ALTER ROLE db_owner ADD MEMBER student;
GO