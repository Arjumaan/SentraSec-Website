import fs from "fs";
import path from "path";

const baseUrl = "https://sentrasec.qzz.io";

function getFiles(dir, files = []) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== ".git" && file !== "node_modules") {
                getFiles(fullPath, files);
            }
        } else if (file.endsWith(".html")) {
            files.push(fullPath);
        }
    });
    return files;
}

const pages = getFiles("./");

const urls = pages
    .map(file => {
        // Clean up path
        let relativePath = path.relative("./", file).replace(/\\/g, "/");
        let loc = relativePath === "index.html" ? "" : relativePath.replace(".html", "");

        return `
  <url>
    <loc>${baseUrl}/${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${loc === "" ? "1.00" : "0.80"}</priority>
  </url>`;
    })
    .join("");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync("sitemap.xml", sitemap);
console.log("sitemap.xml updated!");
