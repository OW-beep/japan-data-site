import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

const PATH = "/en/names-trivia";

export const metadata = {
  alternates: { canonical: PATH },
  title: "Animal Names Hidden in Japan's Towns — and the Longest Place Name in the Country | Japan Municipal Data",
  description:
    "61 Japanese municipalities contain an animal in their name — Bear City, Deer City, Crane City, Turtle City, even a Salmon River Village. Plus Japan's longest municipality names (7 characters) and the famous one-character city of Tsu.",
  openGraph: {
    title: "Animal Names Hidden in Japan's Towns",
    description:
      "Kumamoto = Bear. Kagoshima = Deer. 61 municipalities carry an animal in their name — plus Japan's longest and shortest town names.",
    images: ["/images/og-default.png"],
  },
};

const ANIMALS: [string, string, string, string][] = [
  ["Nerima Ward", "Tokyo", "Horse (馬)", "752,608"],
  ["Kumamoto City", "Kumamoto", "Bear (熊)", "738,865"],
  ["Kagoshima City", "Kagoshima", "Deer (鹿)", "593,128"],
  ["Suzuka City", "Mie", "Deer (鹿)", "195,670"],
  ["Mitaka City", "Tokyo", "Hawk (鷹)", "195,391"],
  ["Kumagaya City", "Saitama", "Bear (熊)", "194,415"],
  ["Tottori City", "Tottori", "Bird (鳥)", "188,465"],
  ["Tsuruoka City", "Yamagata", "Crane (鶴)", "122,347"],
  ["Marugame City", "Kagawa", "Turtle (亀)", "109,513"],
  ["Kanoya City", "Kagoshima", "Deer (鹿)", "101,096"],
];

export default function Page() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          Japan Municipal Data — English
        </Link>
        {" / "}Name trivia
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 8 }}>
        Animal Names Hidden in Japan&apos;s Towns
      </h1>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Published September 1, 2026</p>
      <p style={lead}>
        Japanese place names are written in kanji, and kanji carry meanings.
        Scan all 1,740 municipality names for animal characters and a hidden
        menagerie appears: <strong>61 municipalities</strong> — including
        some of Japan&apos;s biggest cities — have an animal in their name.
        Kumamoto is Bear-Origin. Kagoshima is Deer-Island. And one village
        in Yamagata is named, simply, Salmon River.
      </p>

      <section style={card}>
        <h2 style={h2}>The biggest animal-named municipalities</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={tbl}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left" }}>Municipality</th>
                <th style={{ ...th, textAlign: "left" }}>Animal in the name</th>
                <th style={thR}>Population</th>
              </tr>
            </thead>
            <tbody>
              {ANIMALS.map(([n, p, a, pop]) => (
                <tr key={n}>
                  <td style={{ ...td, textAlign: "left", fontWeight: 600 }}>
                    {n} <span style={{ color: "#6b7280", fontWeight: 400 }}>({p})</span>
                  </td>
                  <td style={{ ...td, textAlign: "left" }}>{a}</td>
                  <td style={tdR}>{pop}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ ...para, marginBottom: 0 }}>
          Deer （鹿） is the most successful animal in big-city names —
          Kagoshima, Suzuka and Kanoya — while bear （熊） claims Kumamoto and
          Kumagaya. Nerima, Tokyo&apos;s horse-named ward, is the largest of
          all at 752,608 people: its name recalls the horse pastures that
          once covered the area.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Small names, perfect fits</h2>
        <p style={para}>
          The small end of the list is where names and reality meet.{" "}
          <strong>Sakegawa Village</strong> (Yamagata, pop. 3,902) is written
          鮭川 — Salmon River — and the river through it is a real salmon
          river. <strong>Tsurui Village</strong> (Hokkaido, pop. 2,558)
          carries the crane （鶴）, and red-crowned cranes genuinely winter in
          its marshes. <strong>Umaji Village</strong> (Kochi, pop. 745) has
          the horse （馬）. And <strong>Sarufutsu Village</strong> (Hokkaido)
          has the monkey （猿） — the same village that ranks #8 in Japan for
          taxpayer income in our{" "}
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            richest municipalities
          </Link>{" "}
          ranking, thanks to scallops. Names, it turns out, are sometimes
          honest advertising and sometimes pure poetry; with 1,740
          municipalities you get plenty of both.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          Of the 61 animal-named municipalities, 34 are cities — the rest are
          towns and villages where the animals are likelier to still be
          around.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Longest and shortest names</h2>
        <p style={para}>
          Japan&apos;s longest municipality names run to seven Japanese
          characters, and all three are merger-era coinages:{" "}
          <strong>Tsukubamirai</strong> (Ibaraki, つくばみらい),{" "}
          <strong>Kasumigaura</strong> (Ibaraki, かすみがうら) and{" "}
          <strong>Ichikikushikino</strong> (Kagoshima, いちき串木野) — names
          assembled in the 2000s municipal mergers by stitching the old towns&apos;
          names together so no community felt erased. At the other extreme,
          the shortest names are two characters including the city suffix:
          Sakai, Kashiwa, Kure, Seki — and most famously{" "}
          <strong>Tsu City</strong> (Mie), whose name is a single character,
          津， making it one of the shortest city names on Earth.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          Mergers explain much of Japan&apos;s name map: the country went
          from over 3,200 municipalities in 1999 to 1,740 today, and many of
          the stranger long names are treaties between merging towns,
          preserved in kanji.
        </p>
      </section>

      <section style={card}>
        <h2 style={h2}>Method and sources</h2>
        <p style={para}>
          Animal names are counted by scanning the official Japanese names of
          all 1,740 municipalities for a set of animal kanji （犬猫牛馬鹿熊猿鳥
          鶴亀蛇竜虎兎羊豚鶏鴨鷹鯉鮭鯖蟹貝雉狐狸猪鷲鵜燕雀鳩烏）, following the
          method of this site&apos;s Japanese name-trivia feature;
          populations are from the 2020 census. Name lengths count Japanese
          characters in the municipality name including its city/town/village
          suffix where applicable. The full feature, in Japanese, is the{" "}
          <Link prefetch={false} href="/articles/municipality-name-trivia" style={link}>
            municipality name trivia article
          </Link>
          .
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          More in English:{" "}
          <Link prefetch={false} href="/en/richest-towns" style={link}>
            Japan&apos;s richest municipalities
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/hidden-gems" style={link}>
            3 towns the crowds haven&apos;t found yet
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/biggest-cities" style={link}>
            Japan&apos;s biggest cities in 2025
          </Link>
          {" · "}
          <Link prefetch={false} href="/en/emptiest-places" style={link}>
            Japan&apos;s emptiest places
          </Link>
        </p>
      </section>

      <p style={{ fontSize: 12, color: "#9ca3af" }}>
        {SITE_NAME} — data on all 1,741 Japanese municipalities, from official statistics.
      </p>
    </main>
  );
}

const lead: React.CSSProperties = { fontSize: 17, lineHeight: 1.9, color: "#374151", marginBottom: 28 };
const card: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 22px 8px", marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.45 };
const para: React.CSSProperties = { fontSize: 15.5, lineHeight: 1.9, color: "#374151" };
const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14, margin: "8px 0 14px" };
const th: React.CSSProperties = { padding: "8px 10px", borderBottom: "2px solid #e5e7eb", textAlign: "center", whiteSpace: "nowrap" };
const thR: React.CSSProperties = { ...th, textAlign: "right" };
const td: React.CSSProperties = { padding: "8px 10px", borderBottom: "1px solid #f3f4f6", textAlign: "center" };
const tdR: React.CSSProperties = { ...td, textAlign: "right", fontVariantNumeric: "tabular-nums" };
const link: React.CSSProperties = { color: "#2563eb", textDecoration: "underline" };
