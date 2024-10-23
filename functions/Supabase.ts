import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = createClient(process.env.supabase_url as string, process.env.supabase_secret as string);

interface Record {
    [key: string]: any;
}

async function getAll(table: string): Promise<Record[]> {
    const { data, error } = await supabase.from(table).select();
    if (error) throw error;
    return data as Record[];
}

async function getById(table: string, id: number): Promise<Record> {
    const { data, error } = await supabase.from(table).select().eq('id', id).single();
    if (error) throw error;
    return data as Record;
}

async function insert(table: string, newItem: Record): Promise<Record[]> {
    const { data, error } = await supabase.from(table).insert([newItem]); // Wrap newItem in an array
    if (error) throw error;
    return data as Record[];
}

async function update(table: string, id: number, updates: Record): Promise<Record[]> {
    const { data, error } = await supabase.from(table).update(updates).eq('id', id);
    if (error) throw error;
    return data as Record[];
}

async function deleteById(table: string, id: number): Promise<Record[]> {
    const { data, error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return data as Record[];
}

export { getAll, getById, insert, update, deleteById };
