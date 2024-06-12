import s from "./form-subscribe.module.scss"

import { countries } from "countries-list"

import cx from "clsx"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/utility/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/utility/form"
import { Input } from "@/components/utility/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/utility/select"

const countryData = Object.entries(countries).map(([key, value]) => {
  return {
    code: key,
    name: value.name,
    phone: value.phone[0],
  }
})

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "It must be a valid email address.",
  }),
  phone: z.string().min(2, {
    message: "Company must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company must be at least 2 characters.",
  }),
  address: z.string().min(2, {
    message: "Company must be at least 2 characters.",
  }),
  taxOffice: z.string().min(2, {
    message: "Company must be at least 2 characters.",
  }),
  taxNumber: z.string().min(2, {
    message: "Company must be at least 2 characters.",
  }),
})

export function FormSubscribe() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      taxOffice: "",
      taxNumber: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("form submitted", data)

    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
  }

  console.log(countryData)

  return (
    <Form {...form}>
      <form className={s.form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className={cx(s.row)}>
          <div className={s.fieldC}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className={s.formItem}>
                  <FormLabel className={s.formLabel}>İsim Soyisim</FormLabel>
                  <FormControl>
                    <Input className={s.input} placeholder="İsim Soyisim" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={s.fieldC}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={s.formItem}>
                  <FormLabel className={s.formLabel}>Eposta</FormLabel>
                  <FormControl>
                    <Input className={s.input} placeholder="Eposta" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className={cx(s.row, "flex")}>
          <div className={s.fieldC}>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className={s.formItem}>
                  <FormLabel className={s.formLabel}>Telefon Numarası</FormLabel>
                  <div className={cx(s.selectC, "flex")}>
                    <Select defaultValue="90">
                      <SelectTrigger defaultValue="90" className={s.countryCodeTrigger}>
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent defaultValue="90" className={s.countryCodeContent}>
                        {countryData.map((country, i) => {
                          return (
                            <SelectItem
                              className={s.countryCodeItem}
                              key={`${i}`}
                              value={`${country.phone}`}
                            >{`${country.name} (+${country.phone})`}</SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                    <FormControl>
                      <Input className={s.input} placeholder="Telefon Numarası" {...field} />
                    </FormControl>
                  </div>

                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className={cx(s.row, "flex")}>
          <div className={s.fieldC}>
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className={s.formItem}>
                  <FormLabel className={s.formLabel}>Şirket Adı</FormLabel>
                  <FormControl>
                    <Input className={s.input} placeholder="Şirket Adı" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className={cx(s.row, "flex")}>
          <div className={s.fieldC}>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className={s.formItem}>
                  <FormLabel className={s.formLabel}>Adres</FormLabel>
                  <FormControl>
                    <Input className={s.input} placeholder="Adres" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className={cx(s.row, "flex")}>
          <div className={s.fieldC}>
            <FormField
              control={form.control}
              name="taxOffice"
              render={({ field }) => (
                <FormItem className={s.formItem}>
                  <FormLabel className={s.formLabel}>Vergi Dairesi</FormLabel>
                  <FormControl>
                    <Input className={s.input} placeholder="Vergi Dairesi" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={s.fieldC}>
            <FormField
              control={form.control}
              name="taxNumber"
              render={({ field }) => (
                <FormItem className={s.formItem}>
                  <FormLabel className={s.formLabel}>Vergi Numarası</FormLabel>
                  <FormControl>
                    <Input className={s.input} placeholder="Vergi Numarası" {...field} />
                  </FormControl>
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
