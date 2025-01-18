export const HOST ='https://portfolio-backend-93su.onrender.com';
export const LOGIN_ROUTE=`${HOST}/api/auth/admin-auth`;
export const VERIFY_OTP=`${HOST}/api/auth/verify-otp`;
export const LOGOUT_ROUTE=`${HOST}/api/auth/admin-logout`
//home routes
export const GET_HOME_DATA=`${HOST}/api/home/get-data`
export const HOME_UPDATE_ROUTE = `${HOST}/api/home/update-home`;
export const HOME_UPLOAD_ROUTE = `${HOST}/api/upload/image`;

//about routes
export const GET_ABOUT_DATA=`${HOST}/api/about/get-about`
export const ABOUT_UPDATE_ROUTE=`${HOST}/api/about/update-about`


export const EDUCATION_UPDATE_ROUTES=`${HOST}/api/education/`

//PROJECT ROUTES
export const PROJECT_GET_ROUTE=`${HOST}/api/project/get-project`
export const PROJECT_ADD_ROUTE=`${HOST}/api/project/addProject`
export const PROJECT_UPDATE_ROUTE = `${HOST}/api/project/update-project`;
export const PROJECT_DELETE_ROUTE = `${HOST}/api/project/delete-project`;

//CERTIFICATE ROUTES
export const ADD_CERTIFICATE_ROUTES = `${HOST}/api/certificate/add-certificate`;
export const GET_CERTIFICATE_ROUTES = `${HOST}/api/certificate/get-certificate`;
export const EDIT_CERTIFICATE_ROUTES = `${HOST}/api/certificate/edit-certificate/`; // Remove the ID from constant
export const DELETE_CERTIFICATE_ROUTES = `${HOST}/api/certificate/delete-certificate/`; // Remove the ID from constant

//Messages Routes
export const CREATE_MESSAGE_ROUTES=`${HOST}/api/messages/make-message`
export const GET_MESSAGE_ROUTES=`${HOST}/api/messages/get-messages`
export const EDIT_MESSAGE_ROUTES=`${HOST}/api/messages/edit-messages/`
export const DELETE_MESSAGE_ROUTE = `${HOST}/api/messages/delete-message/`;

export const DASHBOARD_STAT = `${HOST}/api/dashboard/stats`

export const SKILLS_ROUTES=`${HOST}/api/skills`


//user
export const USER_HOME_DATA=`${HOST}/api/user/userhome-data`
export const USER_ABOUT_DATA = `${HOST}/api/user/userabout-data`;
export const USER_SKILLS_DATA = `${HOST}/api/user/userskills-data`;
export const USER_EDUCATION_DATA = `${HOST}/api/user/usereducation-data`;
export const USER_PROJECTS_DATA =`${HOST}/api/user/projects`
export const USER_PROJECTS_DATA_BY_ID =`${HOST}/api/user/projects`
export const FETCH_RESUME=`${HOST}/api/user/resume`


export const DASHBOARD_STATS = `${HOST}/api/views/stats`
export const PAGE_VIEWS = `${HOST}/api/views/page-views`
export const VISITOR_STATS = `${HOST}/api/views/visitor-stats`
