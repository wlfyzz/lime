import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL as string, process.env.NEXT_PUBLIC_SUPABASE_SECRET as string);

interface Record {
    [key: string]: any;
}

async function getAll(table: string): Promise<Record[]> {
    const { data, error } = await supabase.from(table).select();
    if (error) throw error;
    return data;
}
async function getStaffByID(id: number): Promise<Record | null> {
    const { data, error } = await supabase.from("staff").select().eq('userid', id)
    if (error) throw error;
    return data || "";
}


async function getById(table: string, id: number): Promise<Record | null> {
    const { data, error } = await supabase.from(table).select().eq('id', id).single();
    if (error) throw error;
    return data || "";
}
async function insert(table: string, newItem: Record): Promise<Record[] | null> {
    const { data, error } = await supabase.from(table).insert([newItem]);
    if (error) throw error;
    return data;
}

async function update(table: string, id: number, updates: Record): Promise<Record[] | null> {
    const { data, error } = await supabase.from(table).update(updates).eq('id', id);
    if (error) throw error;
    return data;
}

async function deleteById(table: string, id: number): Promise<Record | null> {
    const { data, error } = await supabase.from(table).delete().eq('id', id).single();
    if (error) throw error;
    return data;
}

export { getAll, getById, insert, update, deleteById, getStaffByID };