import request from "../util/request";

export async function updatePassword(params) {
  return request({
    url: `/xx/`,
    method: "POST",
    data: params,
  });
}
