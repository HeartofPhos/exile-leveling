import fetch from "cross-fetch";

const baseUrl = "https://www.poewiki.net/w/api.php";

interface QueryBuilder {
  tables: string[];
  join_on?: string[];
  fields: string[];
  where?: string;
  order_by?: string[];
}

export async function cargoQuery(queryBuilder: QueryBuilder) {
  let result = [];
  while (true) {
    const url = new URL(baseUrl);
    url.searchParams.append("action", "cargoquery");
    url.searchParams.append("tables", queryBuilder.tables.join(","));
    if (queryBuilder.join_on)
      url.searchParams.append("join on", queryBuilder.join_on.join(","));
    url.searchParams.append("fields", queryBuilder.fields.join(","));
    url.searchParams.append("offset", result.length.toString());
    if (queryBuilder.where)
      url.searchParams.append("where", queryBuilder.where);
    if (queryBuilder.order_by)
      url.searchParams.append("order by", queryBuilder.order_by.join(","));
    url.searchParams.append("format", "json");

    const queryResult: any = await fetch(url.toString()).then((x) => x.json());
    if (queryResult.cargoquery.length == 0) break;
    for (const item of queryResult.cargoquery) {
      result.push(item.title);
    }
  }

  return result;
}

export async function getImageUrl(imagePage: string) {
  const url = new URL(`${baseUrl}/api.php`);
  url.searchParams.append("action", "query");
  url.searchParams.append("titles", imagePage);
  url.searchParams.append("prop", "imageinfo");
  url.searchParams.append("iiprop", "url");
  url.searchParams.append("format", "json");

  const response = await fetch(url.toString()).then((x) => x.json());

  const rootKey = Object.keys(response.query.pages)[0];
  return response.query.pages[rootKey].imageinfo[0].url;
}
