export default function MetricBox({
title,
unit,
definition,
formula,
example,
}: {
title: string;
unit: string;
definition: string;
formula?: string;
example: {
name: string;
value: number;
};
}) {
return ( <div style={box}> <h2 style={titleStyle}>
📖 {title} </h2>


  <p style={definitionStyle}>
    {definition}
  </p>

  {formula && (
    <div style={formulaStyle}>
      {formula}
    </div>
  )}

  <div style={exampleBox}>
    <div>
      <strong>単位</strong>
      <br />
      {unit}
    </div>

    <div>
      <strong>例</strong>
      <br />
      {example.name}
    </div>

    <div>
      <strong>値</strong>
      <br />
      {example.value.toLocaleString()}
      {unit}
    </div>
  </div>
</div>


);
}

const box: React.CSSProperties = {
background: "#ffffff",
borderRadius: 16,
border: "1px solid #e5e7eb",
padding: 20,
marginBottom: 24,
};

const titleStyle: React.CSSProperties = {
marginBottom: 10,
};

const definitionStyle: React.CSSProperties = {
color: "#4b5563",
lineHeight: 1.8,
};

const formulaStyle: React.CSSProperties = {
marginTop: 12,
background: "#eff6ff",
padding: 12,
borderRadius: 8,
fontWeight: 600,
};

const exampleBox: React.CSSProperties = {
marginTop: 16,
display: "grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(150px,1fr))",
gap: 12,
};
