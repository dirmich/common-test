# GitHub Actions 비밀값 적용

## 실행

저장소 루트에서 다음 명령으로 실행합니다.

```powershell
.\githubaction.cmd dev <projectname>
.\githubaction.cmd prod <projectname>
```

Bun으로 직접 실행할 수도 있습니다.

```powershell
bun githubaction.js dev <projectname>
bun githubaction.js prod <projectname>
```

npm 스크립트도 사용할 수 있습니다.

```powershell
npm run githubaction -- dev <projectname>
npm run githubaction -- prod <projectname>
```

## 환경변수 매핑

`dev`는 `DEV_HOST`, `DEV_USER`, `DEV_PORT`, `DEV_PASS`를 읽어 `AWS_SSH_HOST`, `AWS_SSH_USER`, `AWS_SSH_PORT`, `AWS_SSH_PASS` GitHub Secrets에 적용합니다. `prod`는 `MAIN_HOST`, `MAIN_USER`, `MAIN_PORT`, `MAIN_KEY`를 같은 방식으로 적용하고 인증 항목 이름은 `AWS_SSH_KEY`를 사용합니다. 두 환경 모두 `DOCKERHUB_USERNAME`과 `DOCKERHUB_TOKEN`을 사용합니다.

프로젝트별 GitHub Variables는 프로젝트명으로 생성합니다. `DOCKER_REPOSITORY`는 `dirmich/<projectname>b`, `DOCKER_FRONT_REPOSITORY`는 `dirmich/<projectname>`입니다. Docker Hub 네임스페이스는 `.env`의 `DOCKERHUB_NAMESPACE`로 바꿀 수 있습니다.

Secrets는 GitHub 저장소 공개키로 암호화해 전송합니다. 이미 있는 Secret은 교체하고, Variable은 있으면 갱신하고 없으면 만듭니다. GitHub 인증에는 저장소 Actions Secrets와 Variables를 관리할 권한이 있는 `GITHUB_TOKEN`이 필요합니다.

RSA 개인키와 공개키는 `.env`에 PEM 형식으로 보관합니다. SSH의 `MAIN_KEY`는 연결 도구가 받는 OpenSSH 형식이며, Ethereum/DID 키는 사용 라이브러리가 요구하는 hex 문자열입니다. 이 키들을 일괄 변환하면 소비 코드와 호환되지 않을 수 있습니다.

`.env.example`을 `.env`로 복사하고 필요한 값을 입력하세요. 각 소스 파일의 `--filename--` 주석에서 사용하는 환경변수를 확인할 수 있습니다. 실제 `.env`와 키 파일은 커밋하지 않습니다.
