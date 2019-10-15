# Instructions

generate code:
save swagger openapi json and rename it to api.json, put in same directory with json2api console app.
then,
```
npm run generate
```


development :
```
npm install
--update the index.ts
npm pack .
npm install hyperhaul-swagger-scrapper-*.*.*.tgz

or just,

npm publish
```

usage:
```
import { accounts } from  '@hyperhaul/swagger-scrapper';

accounts.token_create().subcribe(console.log);
```
