/* ============================================
   Service VIP - GitHub Auto-Sync Service
   ============================================ */

const GITHUB_REPO = 'alaadanta-byte/Service-VIPP';
const GITHUB_FILE_PATH = 'src/data/siteData.json';

// Helper to convert UTF-8 string to Base64 (Unicode safe)
function utf8ToBase64(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode('0x' + p1);
  }));
}

export async function syncDataToGitHub(data, token) {
  if (!token) {
    console.warn('GitHub Auto-Sync skipped: No token provided');
    return { success: false, message: 'لم يتم توفير رمز GitHub Token' };
  }

  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
    
    // 1. Get existing file SHA if available
    let sha = null;
    try {
      const getRes = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }
    } catch (err) {
      console.warn('Could not fetch existing file SHA', err);
    }

    // 2. Prepare JSON Payload
    const jsonString = JSON.stringify(data, null, 2);
    const contentBase64 = utf8ToBase64(jsonString);

    const bodyPayload = {
      message: `⚡ Auto-sync site data from Admin Dashboard [${new Date().toLocaleString()}]`,
      content: contentBase64,
      branch: 'main'
    };

    if (sha) {
      bodyPayload.sha = sha;
    }

    // 3. Commit file update to GitHub API
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyPayload)
    });

    const resData = await putRes.json();

    if (putRes.ok) {
      return { success: true, message: 'تم الرفع والتعديل على GitHub بنجاح! 🚀' };
    } else {
      console.error('GitHub API Error:', resData);
      return { success: false, message: resData.message || 'حدث خطأ أثناء الرفع إلى GitHub' };
    }
  } catch (error) {
    console.error('GitHub Sync Exception:', error);
    return { success: false, message: error.message || 'خطأ في الاتصال بالإنترنت' };
  }
}
