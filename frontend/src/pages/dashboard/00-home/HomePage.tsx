import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import { api } from "@/api/config/axiosConfig";
// import { LOGOUT_ENDPOINT } from "@/api/endpointsConstants";
// import { Button } from "@/components/ui/button";
// import { useAppDispatch } from "@/hooks/reduxTypedHooks";
// import { publics } from "@/routes/pathConstants";
// import { logout } from "@/store/authSlice";
import {
  // useMutation,
  useQuery,
} from "@tanstack/react-query";
import { GENERAL_REPORT } from "@/api/endpointsConstants";

export default function HomePage() {
  const { isPending, error, data } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: () => api.get(GENERAL_REPORT),
  });

  if (isPending) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading data</p>;
  // const dispatch = useAppDispatch();

  // const { mutate, isPending } = useMutation({
  //   onSuccess: () => {
  //     dispatch(logout());
  //     navigate(publics.LOGIN);
  //   },
  //   mutationFn: () => api.post(LOGOUT_ENDPOINT),
  // });

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 📌 Tarjeta de Total de Evaluaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Total Evaluations</CardTitle>
        </CardHeader>
        <CardContent>{/* <p className="text-2xl font-bold">{data?.totalEvaluations}</p> */}</CardContent>
      </Card>

      {/* 📌 Gráfica de Promedio por Pregunta */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Average Score per Question</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.averages}>
              <XAxis dataKey="questionId" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="averageScore" fill="#4F46E5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
