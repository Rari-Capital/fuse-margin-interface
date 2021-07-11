import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout";

function Trade(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.push("/trade/3");
  }, [router]);

  return <Layout></Layout>;
}

export default Trade;
