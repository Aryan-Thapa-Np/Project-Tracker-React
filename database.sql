-- USERS TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    profile_pic VARCHAR(250) NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'project_manager', 'team_member','team_memberPlus','team_memberSuper') NOT NULL DEFAULT 'team_member',
    email VARCHAR(100) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    pc_token VARCHAR(250) NULL,
    token_type VARCHAR(50) NULL,
    token_expire TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    otp_code int NULL,
    otp_code_type VARCHAR(50) NULL,
    code_expire  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attempts int null,
    status ENUM('active','locked', 'inactive', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_expire TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- PROJECTS TABLE
CREATE TABLE projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    status ENUM('on_track', 'completed', 'pending') DEFAULT 'pending',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MILESTONES TABLE
CREATE TABLE milestones (
    milestone_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    milestone_name VARCHAR(150) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- TASKS TABLE
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    milestone_id int not null,
    assigned_to INT NULL, -- must be nullable to support ON DELETE SET NULL
    task_name VARCHAR(200) NOT NULL,
    status ENUM('todo', 'in_progress', 'completed') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    due_date DATE,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL
);

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('Task', 'Deadline', 'user', 'new_member', 'Document_update', 'announcement') NOT NULL,
    title VARCHAR(255) NOT NULL,
    project VARCHAR(255) DEFAULT 'none',
    icon_class VARCHAR(100) NOT NULL DEFAULT 'faBell',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

    
-- REFRESH TOKENS TABLE
CREATE TABLE refresh_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);




CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);