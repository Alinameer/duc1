  import WrapperEditer from "./WrapperEditer";

  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
   const id = (await params).id
    return <WrapperEditer docId={id} />;
  }
