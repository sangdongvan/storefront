import { Link } from "react-router";

export const headers = {
  "Cache-Control": "public, max-age=300, s-max-age=3600",
};

export default function Home() {
  return (
    <p id="index-page">
      This is a demo for Remix.
      <br />
      <Link to="/login">Go to login</Link>
    </p>
  );
}
