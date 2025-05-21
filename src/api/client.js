// src/api/client.js
export async function callApi(endpoint, options = {}) {
    /* eslint-disable-next-line no-unused-vars */
    options

    // Auth0 훅은 React 컴포넌트 내에서만 쓸 수 있으므로,
    // 여기서는 옵션 객체를 그대로 downstream 컴포넌트에 전달합니다.
    throw new Error('callApi() 는 useAuth0()가 있는 컴포넌트에서 래핑해야함.');
}
