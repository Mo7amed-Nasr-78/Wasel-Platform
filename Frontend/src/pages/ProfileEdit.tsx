import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Main from "@/components/Main";
import Loader from "@/components/Loader";
import FileUploadField from "@/components/FileUploadField";
import { useProps } from "@/components/PropsProvider";
import { useUpdateUser } from "@/api/hooks/user/useUpdateUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PiUser, PiBuildings, PiTextAlignLeft, PiCaretLeft } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import type { ProfileEditFormState } from "@/shared/types/Types";

export default function ProfileEdit() {
    const { user, isLoading } = useProps();
    const navigate = useNavigate();
    const { mutate: updateUser, isPending } = useUpdateUser();
    const [formState, setFormState] = useState<ProfileEditFormState>({
        first_name: "",
        last_name: "",
        phone: "",
        bio: "",
        company_name: "",
        commercialRegister: null,
        dateOfBirth: "",
        gender: "",
        picture: null,
    });

    useEffect(() => {
        if (!user) return;

        setFormState({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            phone: user.phone || "",
            bio: user.bio || "",
            company_name: user.company_name || "",
            commercialRegister: null,
            dateOfBirth: user.dateOfBirth || "",
            gender: user.gender || "",
            picture: null,
        });
    }, [user]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setFormState((prev) => ({ ...prev, [e.target.name]: file }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;

        const formData = new FormData();
        formData.append("first_name", formState.first_name);
        formData.append("last_name", formState.last_name);
        formData.append("phone", formState.phone);
        formData.append("bio", formState.bio);
        formData.append("company_name", formState.company_name);
        formData.append("dateOfBirth", formState.dateOfBirth);
        formData.append("gender", formState.gender);

        if (formState.picture) {
            formData.append("picture", formState.picture);
        }
        if (formState.commercialRegister) {
            formData.append("commercialRegister", formState.commercialRegister);
        }

        updateUser(formData);
    };

    if (isLoading) {
        return <Loader />;
    }

    if (!user) {
        return (
            <Main>
                <section className="container mx-auto min-h-screen px-4 py-24">
                    <div className="rounded-3xl bg-(--secondary-color) p-8 text-center">
                        <p className="text-lg text-(--primary-text)">لم يتم العثور على بيانات المستخدم.</p>
                    </div>
                </section>
            </Main>
        );
    }

    return (
        <Main>
            <section className="container flex flex-col gap-6 mx-auto px-4 sm:px-0 min-h-screen pt-28 mb-24">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate(`/profile/${user.username}`)}
                            className="mb-3 inline-flex items-center gap-1 text-sm text-(--hsecondary-text) transition hover:text-(--primary-color)"
                        >
                            <PiCaretLeft className="text-base" />
                            العودة إلى الملف الشخصي
                        </button>
                        <h1 className="text-2xl sm:text-3xl font-bold text-(--primary-text)">تعديل الملف الشخصي</h1>
                        <p className="mt-1.5 text-sm text-(--secondary-text)">
                            قم بتحديث بياناتك الشخصية ومعلومات الحساب.
                        </p>
                    </div>
                    <Button
                        type="submit"
                        form="profile-edit-form"
                        size="lg"
                        disabled={isPending}
                        className="shrink-0"
                    >
                        {isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </Button>
                </div>

                <form
                    id="profile-edit-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 lg:flex-row lg:items-start"
                >
                    {/* Main column */}
                    <div className="flex-1 min-w-0 space-y-4">
                        {/* Personal info */}
                        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
                            <div className="mb-5 flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--primary-color)/10 text-(--primary-color)">
                                    <PiUser className="h-4 w-4" />
                                </span>
                                <h2 className="text-base font-semibold text-(--primary-text)">المعلومات الأساسية</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-(--primary-text)">اسم المستخدم</label>
                                    <Input name="username" value={user.username} disabled className="bg-muted/50" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-(--primary-text)">الاسم الأول</label>
                                    <Input name="first_name" value={formState.first_name} onChange={handleChange} placeholder="الاسم الأول" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-(--primary-text)">الاسم الأخير</label>
                                    <Input name="last_name" value={formState.last_name} onChange={handleChange} placeholder="الاسم الأخير" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-(--primary-text)">الجنس</label>
                                    <Input name="gender" value={formState.gender} onChange={handleChange} placeholder="ذكر أو أنثى" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-(--primary-text)">الهاتف</label>
                                    <Input name="phone" value={formState.phone} onChange={handleChange} placeholder="رقم الهاتف" />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-(--primary-text)">تاريخ الميلاد</label>
                                    <Input type="date" name="dateOfBirth" value={formState.dateOfBirth} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Company info */}
                        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
                            <div className="mb-5 flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-(--primary-color)">
                                    <PiBuildings className="h-4 w-4" />
                                </span>
                                <h2 className="text-base font-semibold text-(--primary-text)">معلومات الشركة</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-(--primary-text)">اسم الشركة</label>
                                    <Input name="company_name" value={formState.company_name} onChange={handleChange} placeholder="اسم الشركة" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-(--primary-text)">السجل التجاري (مستند)</label>
                                    <FileUploadField
                                        label="رفع السجل التجاري"
                                        name="commercialRegister"
                                        file={formState.commercialRegister}
                                        onChange={handleFileChange}
                                        onClear={() =>
                                            setFormState((prev) => ({
                                                ...prev,
                                                commercialRegister: null,
                                            }))
                                        }
                                        accept=".pdf,.png,.jpg,.jpeg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm">
                            <div className="mb-5 flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-(--primary-color)">
                                    <PiTextAlignLeft className="h-4 w-4" />
                                </span>
                                <h2 className="text-base font-semibold text-(--primary-text)">نبذة عنك</h2>
                            </div>
                            <textarea
                                name="bio"
                                value={formState.bio}
                                onChange={handleChange}
                                rows={5}
                                placeholder="أضف وصفًا قصيرًا عن نفسك أو شركتك"
                                className="w-full resize-none rounded-lg border border-(--tertiary-color) bg-(--bg-color) px-3 py-2.5 text-sm text-(--primary-text) outline-none transition focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/20"
                            />
                        </div>
                    </div>

                    {/* Sidebar column: picture uploader first */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-sm lg:sticky lg:top-28">
                            <label className="mb-3 block text-sm font-medium text-(--primary-text)">الصورة الشخصية</label>
                            <FileUploadField
                                label="رفع صورة جديدة"
                                name="picture"
                                file={formState.picture}
                                onChange={handleFileChange}
                                onClear={() =>
                                    setFormState((prev) => ({
                                        ...prev,
                                        picture: null,
                                    }))
                                }
                                accept="image/*"
                            />
                            <div className="mt-4 flex items-center gap-4 rounded-xl border border-(--tertiary-color)/60 bg-(--bg-color) p-3">
                                <img
                                    src={
                                        formState.picture
                                            ? URL.createObjectURL(formState.picture)
                                            : user.picture || "https://via.placeholder.com/120x120?text=Avatar"
                                    }
                                    alt={user.username}
                                    className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                                />
                                <div>
                                    <p className="text-sm font-medium text-(--primary-text)">الصورة الحالية</p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-(--secondary-text)">
                                        ستُستخدم هذه الصورة في الملف الشخصي.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </Main>
    );
}