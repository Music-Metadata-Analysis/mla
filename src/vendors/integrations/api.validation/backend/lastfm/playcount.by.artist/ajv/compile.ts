import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone";
import fs from "fs";
import path from "path";
import schema from "@src/contracts/api/services/report.cache/lastfm/schemas/playcount.by.artist.json";

const compile = () => {
  const ajv = new Ajv({ code: { source: true } });
  const validate = ajv.compile(schema);
  const moduleCode = standaloneCode(ajv, validate);
  fs.writeFileSync(path.join(__dirname, "generated.js"), moduleCode);
};

compile();
