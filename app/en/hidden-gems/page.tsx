import Link from "next/link";

import { getCity2025 } from "@/lib/city2025";
import { SITE_NAME } from "@/lib/site";

const PATH = "/en/hidden-gems";

export const metadata = {
  alternates: { canonical: PATH },
  title: "3 Japanese Towns the Crowds Haven't Found Yet — Picked by Data | Japan Municipal Data",
  description:
    "Miyama's thatched-roof village, the Edo post town of Ouchi-juku, and Tsumago-juku on the Nakasendo. Three preserved historic towns in rural Japan, selected using census data from all 1,740 Japanese municipalities — not travel hype.",
  openGraph: {
    title: "3 Japanese Towns the Crowds Haven't Found Yet",
    description:
      "Preserved thatched-roof villages and Edo post towns, picked with data from Japan's national census.",
    images: ["/images/en/miyama.webp"],
  },
};

type Town = {
  code: string;
  name: string;
  area: string;
  img: string;
  imgAlt: string;
  credit: string;
  creditUrl: string;
  license: string;
  body: string[];
  access: string;
};

const TOWNS: Town[] = [
  {
    code: "26213",
    name: "Miyama (Kayabuki no Sato), Nantan — Kyoto Prefecture",
    area: "Nantan City, Kyoto",
    img: "/images/en/miyama.webp",
    imgAlt: "Thatched-roof farmhouses in Kayabuki no Sato, Miyama, Nantan City",
    credit: "studio IRONY",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Kayabuki_no_Sato%EF%BC%9A%E3%81%8B%E3%82%84%E3%81%B6%E3%81%8D%E3%81%AE%E9%87%8C_-_panoramio.jpg",
    license: "CC BY 3.0",
    body: [
      "About 90 minutes from central Kyoto, the hamlet of Miyama keeps around 50 farmhouses with steep thatched (kayabuki) roofs — one of the largest surviving clusters in Japan. Unlike the famous Shirakawa-go, it is still a living village: people farm, commute and send their kids to school here.",
      "There are no souvenir streets or tour-bus parking lots. What you get instead is a working mountain village, a small thatched-roof museum, and some of the clearest night skies in the Kansai region.",
    ],
    access:
      "JR Sagano/San'in Line to Hiyoshi Station, then a Nantan city bus to Miyama (about 50 minutes). Driving from Kyoto City takes about 90 minutes.",
  },
  {
    code: "07362",
    name: "Ouchi-juku, Shimogo — Fukushima Prefecture",
    area: "Shimogo Town, Fukushima",
    img: "/images/en/ouchi.webp",
    imgAlt: "The main street of Ouchi-juku lined with thatched-roof houses",
    credit: "Σ64",
    creditUrl: "https://commons.wikimedia.org/wiki/File:Ouchi-juku,_Fukushima_01.jpg",
    license: "CC BY 4.0",
    body: [
      "Ouchi-juku was a post town on the road between Aizu and Nikko, and its single main street is still lined with thatched-roof houses from the Edo period. Power lines are buried, signs are restrained, and the irrigation channels still run along the street.",
      "The local specialty is negi soba — buckwheat noodles eaten with a long green onion instead of chopsticks. The whole town has fewer residents than a single Tokyo apartment block, which is exactly why the streetscape survived.",
    ],
    access:
      "Aizu Railway to Yunokami-Onsen Station, then about 15 minutes by bus or taxi. Roughly 3.5 hours from Tokyo with a Shinkansen connection at Koriyama.",
  },
  {
    code: "20423",
    name: "Tsumago-juku, Nagiso — Nagano Prefecture",
    area: "Nagiso Town, Nagano",
    img: "/images/en/tsumago.webp",
    imgAlt: "The preserved main street of Tsumago-juku on the Nakasendo",
    credit: "DimiTalen",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:Looking_up_the_Nakasend%C5%8D_in_the_central_part_of_the_village,_Tsumago-juku,_Nagiso,_2016.jpg",
    license: "CC0",
    body: [
      "Tsumago was the 42nd of the 69 post towns on the Nakasendo, the mountain road that linked Kyoto and Edo (old Tokyo). Residents began restoring the town in the 1960s — before heritage tourism was fashionable — with three rules: don't sell, don't rent out, don't destroy the old houses.",
      "The best way to experience it is on foot: the preserved 8 km trail over the Magome Pass to the next post town, Magome, takes about three hours through cedar forest and farmland. A luggage-forwarding service lets you walk it with just a daypack.",
    ],
    access:
      "JR Chuo Line to Nagiso Station, then a 10-minute bus. About 80 minutes from Nagoya, including the limited express to Nakatsugawa or Nagiso.",
  },
];

export default function Page() {
  const kyoto = getCity2025("26100");

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 72px" }}>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
        <Link prefetch={false} href="/" style={{ color: "#2563eb" }}>
          {SITE_NAME}
        </Link>{" "}
        — English edition (pilot article)
      </p>

      <h1 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.35, marginBottom: 16 }}>
        3 Japanese Towns the Crowds Haven&rsquo;t Found Yet — Picked by Data, Not Hype
      </h1>

      <p style={lead}>
        Japan&rsquo;s famous old towns are struggling with overtourism, while equally
        well-preserved places a few valleys away stay quiet. We maintain a database of
        all 1,740 Japanese municipalities built from the national census, so we picked
        three historic towns the data says are still genuinely rural — tiny populations,
        low density, and streetscapes that survived because these places were never
        on the main tourist route.
      </p>

      {TOWNS.map((t) => {
        const city = getCity2025(t.code);
        return (
          <section key={t.code} style={card}>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{t.name}</h2>
            <figure style={{ margin: "0 0 6px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.img}
                alt={t.imgAlt}
                width={1200}
                height={800}
                loading="lazy"
                style={{ width: "100%", height: "auto", borderRadius: 12 }}
              />
              <figcaption style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>
                Photo:{" "}
                <a href={t.creditUrl} style={{ color: "#2563eb" }} rel="noopener noreferrer" target="_blank">
                  {t.credit}
                </a>{" "}
                ({t.license}), via Wikimedia Commons
              </figcaption>
            </figure>
            {t.body.map((p) => (
              <p key={p.slice(0, 24)} style={para}>
                {p}
              </p>
            ))}
            {city && (
              <div style={statRow}>
                <span style={chip}>
                  Population <strong>{city.population.toLocaleString()}</strong>
                </span>
                {city.populationDensity != null && (
                  <span style={chip}>
                    Density <strong>{city.populationDensity.toLocaleString()}/km²</strong>
                  </span>
                )}
                {city.agingRate != null && (
                  <span style={chip}>
                    Aged 65+ <strong>{city.agingRate.toFixed(1)}%</strong>
                  </span>
                )}
                <Link
                  prefetch={false}
                  href={`/city/${t.code}`}
                  style={{ ...chip, color: "#2563eb", textDecoration: "none" }}
                >
                  Full data for {t.area.split(",")[0]} (Japanese) →
                </Link>
              </div>
            )}
            <p style={{ ...para, marginBottom: 0 }}>
              <strong>Getting there:</strong> {t.access}
            </p>
          </section>
        );
      })}

      <section style={card}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>How we picked them</h2>
        <p style={para}>
          Each town had to meet two tests. First, a nationally recognised preserved
          streetscape — thatched-roof settlements or Edo-period post towns. Second, the
          census numbers had to confirm the town is still rural: all three municipalities
          have population densities under 60 people per km²
          {kyoto?.populationDensity != null && (
            <>
              , compared with {kyoto.populationDensity.toLocaleString()} per km² in
              Kyoto City
            </>
          )}
          . High ageing rates (over 40% in two of the three) are part of the honest
          picture: these villages are preserved by small, ageing communities, and
          visiting respectfully — staying overnight locally, buying from local shops —
          genuinely helps.
        </p>
        <p style={{ ...para, marginBottom: 0 }}>
          Population and density figures are from Japan&rsquo;s national census as
          compiled in our municipal database. Access times are approximate; check
          current timetables before you go, as rural bus services change frequently.
        </p>
      </section>

      <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.9 }}>
        This is a pilot English article from {SITE_NAME}, a Japanese site that ranks
        and compares all of Japan&rsquo;s municipalities by population, demographics,
        public finances and more.{" "}
        <Link prefetch={false} href="/" style={{ color: "#2563eb" }}>
          Explore the full data (in Japanese) →
        </Link>
      </p>
      <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.9 }}>
        More in English:{" "}
        <Link prefetch={false} href="/en/akiya" style={{ color: "#2563eb" }}>
          Akiya: where the empty houses really are
        </Link>
        {" · "}
        <Link prefetch={false} href="/en/growing-towns" style={{ color: "#2563eb" }}>
          Japan is shrinking — but these towns are growing
        </Link>
        {" · "}
        <Link prefetch={false} href="/en" style={{ color: "#2563eb" }}>
          All English guides
        </Link>
      </p>
    </main>
  );
}

const lead: React.CSSProperties = { fontSize: 17, lineHeight: 1.9, color: "#374151", marginBottom: 28 };
const para: React.CSSProperties = { fontSize: 16, lineHeight: 1.9, color: "#1f2937", margin: "0 0 14px" };
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: "22px 22px 18px",
  marginBottom: 24,
};
const statRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8, margin: "4px 0 14px" };
const chip: React.CSSProperties = {
  background: "#f3f4f6",
  border: "1px solid #e5e7eb",
  borderRadius: 999,
  padding: "4px 12px",
  fontSize: 13,
  color: "#374151",
};
