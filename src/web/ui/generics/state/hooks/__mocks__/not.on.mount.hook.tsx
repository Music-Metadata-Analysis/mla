import { useEffect } from "react";

// eslint-disable-next-line react-hooks/exhaustive-deps
export default jest.fn((func, deps) => useEffect(() => func(), deps));
