import axios from "axios";
import React from "react";

const HomePage = () => {
  const [lib, setLib] = React.useState();
  const [searchTerm, setTerm] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {}, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await axios.get(`http://localhost:3000/search?s=${searchTerm}`);
    if (res) {
      setLib(res.data);
      setIsLoading(false);
    } else {
      setError("Package could not be found");
      setIsLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSearch}>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setTerm(e.target.value)}
        />
      </form>
      {isLoading ? <h3>Loading ... </h3> : <>{JSON.stringify(lib, null, 2)}</>}
    </React.Fragment>
  );
};

export { HomePage };
