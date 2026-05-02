export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      lesson_item_participants: {
        Row: {
          activity_count: number | null;
          created_at: string | null;
          feedback: boolean | null;
          id: string;
          lesson_item_id: string;
          member_id: string;
          quiz_points: number | null;
          updated_at: string | null;
        };
        Insert: {
          activity_count?: number | null;
          created_at?: string | null;
          feedback?: boolean | null;
          id?: string;
          lesson_item_id: string;
          member_id: string;
          quiz_points?: number | null;
          updated_at?: string | null;
        };
        Update: {
          activity_count?: number | null;
          created_at?: string | null;
          feedback?: boolean | null;
          id?: string;
          lesson_item_id?: string;
          member_id?: string;
          quiz_points?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_item_participants_lesson_item_id_fkey';
            columns: ['lesson_item_id'];
            isOneToOne: false;
            referencedRelation: 'lesson_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lesson_item_participants_member_id_fkey';
            columns: ['member_id'];
            isOneToOne: false;
            referencedRelation: 'members';
            referencedColumns: ['id'];
          },
        ];
      };
      lesson_items: {
        Row: {
          author_id: string;
          cover_url: string | null;
          created_at: string | null;
          description: string | null;
          file_url: string | null;
          icon: string | null;
          id: string;
          lesson_id: string;
          meet_url: string | null;
          order: number;
          quiz_url: string | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          author_id: string;
          cover_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          file_url?: string | null;
          icon?: string | null;
          id?: string;
          lesson_id: string;
          meet_url?: string | null;
          order: number;
          quiz_url?: string | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string;
          cover_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          file_url?: string | null;
          icon?: string | null;
          id?: string;
          lesson_id?: string;
          meet_url?: string | null;
          order?: number;
          quiz_url?: string | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'lesson_items_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'members';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lesson_items_lesson_id_fkey';
            columns: ['lesson_id'];
            isOneToOne: false;
            referencedRelation: 'lessons';
            referencedColumns: ['id'];
          },
        ];
      };
      lessons: {
        Row: {
          cover_url: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          cover_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          cover_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      member_claims: {
        Row: {
          code: string;
          created_at: string;
          exp: string;
          member_id: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          exp: string;
          member_id: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          exp?: string;
          member_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'member_claims_member_id_fkey';
            columns: ['member_id'];
            isOneToOne: true;
            referencedRelation: 'members';
            referencedColumns: ['id'];
          },
        ];
      };
      members: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          generation: string;
          id: string;
          is_active: boolean;
          name: string;
          role: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          generation: string;
          id?: string;
          is_active?: boolean;
          name: string;
          role: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          generation?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          role?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      claim_member: {
        Args: { p_claim_code: string };
        Returns: {
          avatar_url: string | null;
          created_at: string | null;
          generation: string;
          id: string;
          is_active: boolean;
          name: string;
          role: string;
          updated_at: string | null;
          user_id: string | null;
        };
        SetofOptions: {
          from: '*';
          to: 'members';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      is_staff: { Args: never; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
