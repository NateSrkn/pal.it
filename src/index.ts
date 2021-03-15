import PalIt = require("./browser");

((ns: any) => {
  ns.PalIt = PalIt;
})(
  typeof window === "object" && window instanceof Window
    ? window
    : module.exports
);
