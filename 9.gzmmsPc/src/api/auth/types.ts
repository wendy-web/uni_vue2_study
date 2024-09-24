/**
 * 登录数据类型
 */
export interface LoginData {
  username: string;
  password: string;
}

// 登录响应数据类型
export interface TokenResult {
  token: string;
  user: {
    id: number;
    role_id: string;
    name: string;
    user: string;
    head_url: string;
    status: string;
    create_time: string;
    openid?: string | number | null;
  };
}
