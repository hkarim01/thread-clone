import Image from "next/image";

const loading = () => {
  return (
    <section className="flex flex-col w-full items-center gap-3 mt-10">
      <Image
        src="/assets/loaderMulti.svg"
        alt="loader"
        height={36}
        width={36}
      />
      <h1 className="text-light-1">loading...</h1>
    </section>
  );
};

export default loading;
