# ring-faceauth-web-api

Ring Doorbell/Amazon Rekognitionを使った顔認証解錠

## APIドキュメント

https://nana4rider.github.io/ring-faceauth-web-api/

## データベース構成の変更
```
npm run typeorm:generate-migration ./src/migration/[name]
npm run typeorm:run-migrations
```

## get refresh token
npx -p ring-client-api ring-auth-cli
