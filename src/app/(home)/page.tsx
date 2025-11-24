import Link from 'next/link';
import { CheckCircle2, ListTodo, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Gestiona tus tareas de forma simple
          </h1>

          <p className="text-lg text-muted-foreground">
            Organiza tu trabajo, mantén el control de tus pendientes y aumenta tu productividad.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild>
              <Link href="/signUp">Comenzar ahora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tasks">Ver tareas</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <ListTodo className="w-6 h-6" />
              </div>
              <CardTitle>Organiza tus tareas</CardTitle>
              <CardDescription>
                Crea y organiza tus tareas de manera sencilla
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Clock className="w-6 h-6" />
              </div>
              <CardTitle>Gestiona tu tiempo</CardTitle>
              <CardDescription>
                Establece prioridades y fechas límite para tus tareas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <CardTitle>Completa objetivos</CardTitle>
              <CardDescription>
                Marca tus tareas como completadas y alcanza tus metas
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
