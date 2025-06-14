import monitoringView from '../views/MonitoringPage';
import Home from '../views/MonitoringPage';
import LoginPage from '../pages/LoginPage/LoginPage';
//views 폴더의 .jsx 파일을 라우팅 할 때 사용



// 홈화면
// const routes = [
//     {
//         path : '/',
//         component : Home,
//         name : 'Home',
//     }
// ]

// 마이페이지
const routes = [
    {
        path : '/',
        component : LoginPage,
        name : 'Login',
    },
    {
        path : '/monitoring',
        component : monitoringView,
        name : 'MonitoringPage',
    }
]


// 모니터링
// const routes = [
//     {
//         path : '/',
//         component : Home,
//         name : 'Home',
//     }
// ]

// 위시리스트
// const routes = [
//     {
//         path : '/',
//         component : Home,
//         name : 'Home',
//     }
// ]


// 로그인
// const routes = [
//     {
//         path : '/',
//         component : Home,
//         name : 'Home',
//     }
// ]


//결재창
// const routes = [
//     {
//         path : '/',
//         component : Home,
//         name : 'Home',
//     }
// ]

export default routes;