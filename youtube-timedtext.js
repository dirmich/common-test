import axios from "axios"

/**
 * YouTube 동영상 ID를 사용하여 자막 URL 목록을 가져옵니다.
 * @param {string} youtubeId 가져올 YouTube 동영상 ID
 * @returns {Promise<string[]>} 자막 URL의 배열을 담은 프로미스
 */
async function getCaptionUrls(youtubeId) {
  if (!youtubeId) {
    throw new Error("YouTube ID가 제공되지 않았습니다.")
  }

  try {
    const url = `https://www.youtube.com/watch?v=${youtubeId}`
    const { data: html } = await axios.get(url)

    // ytInitialPlayerResponse 객체를 찾기 위한 정규식
    const match = html.match(/var ytInitialPlayerResponse = ({.*?});/)

    if (!match || !match[1]) {
      throw new Error(
        "플레이어 응답 데이터를 찾을 수 없습니다. 동영상이 비공개이거나 삭제되었을 수 있습니다."
      )
    }

    const playerResponse = JSON.parse(match[1])

    const captionTracks =
      playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks

    if (!captionTracks || captionTracks.length === 0) {
      console.log("이 동영상에는 자막 트랙이 없습니다.")
      return []
    }

    const urls = captionTracks.map((track) => track.baseUrl)
    return urls
  } catch (error) {
    console.error(`자막 URL을 가져오는 중 오류 발생: ${error.message}`)
    if (error.response) {
      console.error("응답 상태:", error.response.status)
    }
    throw error
  }
}

/**
 * URL에서 자막 데이터를 가져와 출력합니다.
 * @param {string} captionUrl 가져올 자막 URL
 */
async function fetchAndPrintCaption(captionUrl) {
  try {
    // URL에서 \u0026를 &로 변환합니다.
    const cleanedUrl = captionUrl.replace(/\\u0026/g, "&") + "&fmt=vtt"
    console.log(`\n정리된 URL에서 자막을 가져오는 중: ${cleanedUrl}`)

    const { data: captionData } = await axios.get(cleanedUrl)

    console.log("--- 자막 데이터 시작 ---")
    console.log(captionData)
    console.log("--- 자막 데이터 종료 ---")
  } catch (error) {
    console.error(
      `자막 데이터를 가져오는 중 오류 발생 (URL: ${captionUrl}): ${error.message}`
    )
  }
}

// --- 예제 사용법 ---
async function main() {
  const testVideoId = "x0OwF0pIqrY"

  console.log(`'${testVideoId}' 동영상의 자막 URL을 가져오는 중...`)

  try {
    const captionUrls = await getCaptionUrls(testVideoId)

    if (captionUrls.length > 0) {
      console.log("찾은 자막 URL 목록:")
      captionUrls.forEach((url, index) => {
        console.log(`${index + 1}: ${url}`)
      })

      // 각 URL에 대해 자막 데이터를 가져옵니다.
      for (const url of captionUrls) {
        await fetchAndPrintCaption(url)
      }
    } else {
      console.log("자막 URL을 찾지 못했습니다.")
    }
  } catch (error) {
    console.error("스크립트 실행 중 최종 오류:", error.message)
  }
}

// 이 파일이 직접 실행될 때만 main 함수를 호출합니다.
import { fileURLToPath } from "url"
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}

export { getCaptionUrls }
