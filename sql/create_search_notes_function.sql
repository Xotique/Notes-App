create or replace function public.search_notes(search_term text)
returns setof notes as $$
begin
  return query
  select n.* from notes n
  where n.title ilike '%' || search_term || '%'
     or n.content ilike '%' || search_term || '%'
     or exists (
       select 1 from jsonb_array_elements_text(n.tags) as tag
       where tag ilike '%' || search_term || '%'
     );
end;
$$ language plpgsql;

-- Create a function to get all unique tags
create or replace function public.get_all_tags()
returns table(tag text) as $$
begin
  return query
  select name as tag from tags
  order by name;
end;
$$ language plpgsql;
