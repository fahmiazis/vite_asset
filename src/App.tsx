import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { router } from "./routers";
import { Toaster } from "react-hot-toast";
import { queryClient } from "./libs/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <RouterProvider router={router} />
      {/* Kiri bawah: bar aksi di halaman detail transaksi rata kanan bawah,
          jadi tombol devtools di posisi default menutupinya. */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}

export default App;
