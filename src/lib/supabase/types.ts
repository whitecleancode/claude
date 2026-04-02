export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          color: string;
          icon: string;
          frequency: "daily" | "weekdays" | "weekends" | "custom";
          custom_days: number[] | null;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          color?: string;
          icon?: string;
          frequency?: "daily" | "weekdays" | "weekends" | "custom";
          custom_days?: number[] | null;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          icon?: string;
          frequency?: "daily" | "weekdays" | "weekends" | "custom";
          custom_days?: number[] | null;
          is_archived?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          user_id: string;
          completed_date: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          user_id?: string;
          completed_date?: string;
          note?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "habit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      task_categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          icon: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          icon?: string | null;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "task_categories_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          title: string;
          description: string | null;
          priority: "low" | "medium" | "high" | "urgent";
          status: "todo" | "in_progress" | "done" | "cancelled";
          due_date: string | null;
          completed_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          title: string;
          description?: string | null;
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "todo" | "in_progress" | "done" | "cancelled";
          due_date?: string | null;
          completed_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          title?: string;
          description?: string | null;
          priority?: "low" | "medium" | "high" | "urgent";
          status?: "todo" | "in_progress" | "done" | "cancelled";
          due_date?: string | null;
          completed_at?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "task_categories";
            referencedColumns: ["id"];
          }
        ];
      };
      nutrition_goals: {
        Row: {
          id: string;
          user_id: string;
          calories_target: number;
          protein_target: number;
          fat_target: number;
          carbs_target: number;
          effective_from: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          calories_target?: number;
          protein_target?: number;
          fat_target?: number;
          carbs_target?: number;
          effective_from?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          calories_target?: number;
          protein_target?: number;
          fat_target?: number;
          carbs_target?: number;
          effective_from?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "nutrition_goals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      nutrition_logs: {
        Row: {
          id: string;
          user_id: string;
          logged_date: string;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack";
          name: string;
          calories: number;
          protein: number;
          fat: number;
          carbs: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          logged_date?: string;
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack";
          name: string;
          calories?: number;
          protein?: number;
          fat?: number;
          carbs?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          logged_date?: string;
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack";
          name?: string;
          calories?: number;
          protein?: number;
          fat?: number;
          carbs?: number;
        };
        Relationships: [
          {
            foreignKeyName: "nutrition_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
