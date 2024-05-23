import axios from "axios";

const url = 'https://api.github.com';

async function extractShaId({
  username,
  reposName,
  access_token,
  id
}: {
  username: string;
  reposName: string;
  access_token: string;
  id: number;
}): Promise<Sha | undefined>{
  const url = 'https://api.github.com/repos/' + username + '/' + reposName + '/commits'; 
  const shaData: string[] = [];
  try {
    const response = await axios.get(url, {
      data: {access_token: access_token},
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
    }});
    const dataLen = response.data.length;
    for (let i = 0; i < dataLen; i++) {
      shaData.push(response.data[i].sha);
    }
    const shaDataWithRepoName: Sha = { reposName: reposName, sha: shaData, username: username, access_token: access_token, id: id};
    return shaDataWithRepoName;
  } catch (e: any) {
    console.error(e);
    return;
  }
  
}

async function extractLinesOfCode(shaObj: Sha): Promise<number[]> {
  const baseUrl = 'https://api.github.com/repos/' +　shaObj.username + '/' + shaObj.reposName + '/commits/';
  const promises = shaObj.sha.map(async(sha) => {
    const url = baseUrl + sha;
    try {
      const response = await axios.get(url,{
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + shaObj.access_token,
        },
        data: {access_token: shaObj.access_token}
      });
      const linesOfCode: number = response.data.stats.total;
      return linesOfCode;
    } catch (e: any) {
      console.error(e);
      return 0;
    }
  });
  return Promise.all(promises);
}

async function getUsersAllRepos(access_token: string) {
  const data = {access_token: access_token};
  try {
      const response = await axios.get(
          url + '/user/repos',
          {
              data: data,
              headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Accept': 'application/vnd.github.v3+json',
              }
          }
      );
      return {repos: response.data, access_token: access_token};
  } catch (error: any) {
      console.error(error.response);
      return　{repos: [], access_token: ''};
  }
}

async function getUserInfo(access_token: string) {
  const data = {access_token: access_token};
  try{
      const response = await axios.get(
          url + '/user',
          {
              data: data,
              headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Accept': 'application/vnd.github.v3+json',
              }
          }
      );
      return(response.data);
  } catch(e) {
      return;
  }
}

export{ extractShaId, extractLinesOfCode, getUsersAllRepos, getUserInfo}