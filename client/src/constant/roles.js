export const ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student',
}


export const ROLE_ROUTES = {
    [ROLES.ADMIN]: '/admin',
    [ROLES.TEACHER]: '/teacher',
    [ROLES.STUDENT]: '/student',
}

export const ROLE_DASHBOARD = {
    [ROLES.ADMIN]: '/admin/dashboard',
    [ROLES.TEACHER]: '/teacher/dashboard',
    [ROLES.STUDENT]: '/student/dashboard',
}