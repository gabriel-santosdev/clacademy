-- Supabase expõe o schema "public" pela Data API (chave publishable/anon).
-- Com RLS ligado e sem policies, essa API não lê nem grava nada.
-- O app conecta como dono das tabelas, que ignora RLS, então nada muda para ele.
-- Ao criar novas tabelas, rode esta migration de novo (ou repita o ENABLE na nova migration).
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END $$;
